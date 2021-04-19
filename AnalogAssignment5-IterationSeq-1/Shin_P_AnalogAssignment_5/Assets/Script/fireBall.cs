using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class fireBall : MonoBehaviour
{
    public Transform explosion;
    AudioSource audioSource;
    public AudioClip bossHurtSound;

    public float projectileSpeed = 20f;
    public int damage = 20;
    public Rigidbody2D rb;
    
    // Start is called before the first frame update
    void Start()
    {
        rb.velocity = transform.right * projectileSpeed;
        audioSource = GetComponent<AudioSource>();
    }

    /* Do something if fireBall collides with an enemy */
    private void OnTriggerEnter2D(Collider2D collision)
    {
        Debug.Log("Collided with: " + collision.name);

        //TODO --> deal damage to enemy/boss

        Instantiate(explosion, transform.position, Quaternion.identity);

        if (collision.name == "skeletonSoldier")
        {
            AudioSource.PlayClipAtPoint(bossHurtSound, transform.position, 5.0f);
        }

        Destroy(gameObject);
    }
}
