using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BossMovement : MonoBehaviour
{
    public float timeBetweenAttacks = 1.0f;
    private float timer = 0f;

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
        
        //Debug.Log(transform.position.y);
        if (timer >= timeBetweenAttacks)
        {
            fire();
            timer = 0;
        }
    }

    /* Fires laser */
    void fire()
    {
        Instantiate(projectilePrefab, firePoint.position, Quaternion.identity);
    }
}
