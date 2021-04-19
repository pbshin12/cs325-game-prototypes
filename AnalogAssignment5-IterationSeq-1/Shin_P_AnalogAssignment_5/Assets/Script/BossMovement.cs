using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BossMovement : MonoBehaviour
{
    public float timeBetweenAttacks = 1.0f;
    private float timer = 0f;

    
    public Transform explosion;

    public float speed = 1.0f;
    public float height = 0.5f;
    public float startPosition = 6.0f;
    public GameObject boss;
    public GameObject projectilePrefab;
    public Transform firePoint;
    
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        timer += Time.deltaTime;

        //calculate what the new Y position will be
        float newY = Mathf.Sin(Time.time * speed);
        //set the object's Y to the new calculated Y
        boss.transform.position = new Vector2(startPosition, newY) * height;
        
        if (GameManager.phase == 2)
        {
            timeBetweenAttacks = 0.75f;
        }
        if (GameManager.phase == 3)
        {
            timeBetweenAttacks = 0.45f;
        }

        //Debug.Log(transform.position.y);
        if (timer >= timeBetweenAttacks)
        {
            fire();
            timer = 0;
        }

        if (GameManager.bossHealth <= 0)
        {
            Instantiate(explosion, transform.position, Quaternion.identity);
            GameManager.bossAlive = false;
            Destroy(gameObject);
        }
    }

    /* Fires laser */
    void fire()
    {
        Instantiate(projectilePrefab, firePoint.position, Quaternion.identity);
    }
}
